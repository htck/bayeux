# -*- mode: ruby -*-
#
# Vagrantfile for role tests
#
Vagrant.configure(2) do |config|
  config.vm.box = "debian/jessie64"
  config.vm.network "forwarded_port", guest: 80, host: 8080

  config.vm.provision "shell", path: "vagrant_provision.sh"

  # Forward des connexions ssh
  config.ssh.forward_agent = true

  config.vm.provider "virtualbox" do |v|
    v.name   = "htck"
    v.memory = 2048
  end
end